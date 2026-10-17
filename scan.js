// ============================================================
// BARCODE READER
// Reads food barcodes (EAN-13, EAN-8, UPC-A, UPC-E) from the live
// camera or from a photo.
//
// It uses ZXing, the same open-source barcode engine many scanner
// apps use, compiled to WebAssembly so it runs fast in the browser.
// The engine files live in the lib/ folder, so it also works offline.
// On phones that have a built-in barcode reader (most Androids),
// that is tried first because it's even faster.
// ============================================================

const BARCODE_FORMATS = ["EAN-13", "EAN-8", "UPC-A", "UPC-E"];

// ---------- Load the engine (only once) ----------
let zxingPromise = null;
function getZXing() {
  if (!zxingPromise) {
    if (typeof ZXingWASM === "undefined") return Promise.reject(new Error("Barcode engine didn't load"));
    zxingPromise = ZXingWASM.prepareZXingModule({
      overrides: {
        // Load the .wasm file from our own lib/ folder instead of the internet
        locateFile: (path, prefix) => path.endsWith(".wasm") ? new URL("lib/zxing_reader.wasm", document.baseURI).href : prefix + path
      },
      fireImmediately: true
    }).then(() => ZXingWASM).catch(e => { zxingPromise = null; throw e; });
  }
  return zxingPromise;
}

// The phone's built-in reader, if it has one that knows food barcodes
let nativeDetector = null;
(async function setUpNative() {
  try {
    if (!("BarcodeDetector" in window)) return;
    const have = await BarcodeDetector.getSupportedFormats();
    const want = ["ean_13", "ean_8", "upc_a", "upc_e"].filter(f => have.includes(f));
    if (want.length) nativeDetector = new BarcodeDetector({ formats: want });
  } catch (e) { nativeDetector = null; }
})();

// Look for a barcode in one picture (ImageData). Returns the number, or null.
async function decodeBarcode(imageData) {
  if (nativeDetector) {
    try {
      const found = await nativeDetector.detect(imageData);
      if (found.length && /^\d{8,14}$/.test(found[0].rawValue)) return found[0].rawValue;
    } catch (e) { /* fall through to ZXing */ }
  }
  const Z = await getZXing();
  const results = await Z.readBarcodes(imageData, {
    formats: BARCODE_FORMATS, tryHarder: true, tryRotate: true, tryInvert: false, maxNumberOfSymbols: 1
  });
  const good = results.find(r => r.isValid && /^\d{8,14}$/.test(r.text));
  return good ? good.text : null;
}

// Draw (part of) an image onto a canvas at a given size and get its pixels
function pixels(source, sx, sy, sw, sh, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale)), h = Math.max(1, Math.round(sh * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

// Open a photo file, turned the right way up
async function openPhoto(file) {
  if (window.createImageBitmap) {
    try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch (e) {}
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't open that photo"));
    img.src = URL.createObjectURL(file);
  });
}

// ---------- Read a barcode from a photo ----------
// Phone photos are huge (12+ megapixels) and the barcode is often small,
// so try a few sizes, then try zooming into the middle of the photo.
async function readBarcodeFromPhoto(file) {
  const img = await openPhoto(file);
  const W = img.width || img.naturalWidth, H = img.height || img.naturalHeight;
  const tries = [
    [0, 0, W, H, 1600],
    [0, 0, W, H, 1000],
    [W * 0.15, H * 0.15, W * 0.7, H * 0.7, 1600],   // middle of the photo, zoomed in
    [0, 0, W, H, 2600],
    [W * 0.25, H * 0.25, W * 0.5, H * 0.5, 1400]
  ];
  for (const [x, y, w, h, max] of tries) {
    const code = await decodeBarcode(pixels(img, x, y, w, h, max));
    if (code) return code;
  }
  return null;
}

// ---------- Live camera scanning ----------
// startLiveScan(box, onFound) shows the camera in `box` and calls
// onFound(code) when it reads a barcode. Returns a stop() function.
async function startLiveScan(box, onFound) {
  getZXing().catch(() => {});   // start loading the engine while the camera warms up

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
  });

  // Ask for auto-focus that keeps adjusting (helps a lot with small barcodes)
  const track = stream.getVideoTracks()[0];
  try {
    const caps = track.getCapabilities ? track.getCapabilities() : {};
    if (caps.focusMode && caps.focusMode.includes("continuous")) {
      await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
    }
  } catch (e) {}

  const video = document.createElement("video");
  video.setAttribute("playsinline", "");   // iPhone: play inside the page, not full screen
  video.setAttribute("autoplay", "");
  video.muted = true;
  video.srcObject = stream;
  const frame = document.createElement("div");
  frame.className = "scan-frame";
  frame.innerHTML = '<div class="scan-line"></div>';
  box.innerHTML = "";
  box.append(video, frame);
  await video.play();

  let running = true, last = null, timer = null;

  async function tick() {
    if (!running) return;
    const vw = video.videoWidth, vh = video.videoHeight;
    if (vw && vh) {
      // Look at the middle band of the picture (where the box is drawn)
      const sw = vw * 0.9, sh = vh * 0.6;
      try {
        const code = await decodeBarcode(pixels(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 1280));
        if (!running) return;
        // Only accept a number after reading it twice in a row, to avoid misreads
        if (code && code === last) { stop(); onFound(code); return; }
        last = code || last;
      } catch (e) { /* engine still loading: just try again */ }
    }
    timer = setTimeout(tick, 120);
  }

  function stop() {
    running = false;
    clearTimeout(timer);
    stream.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }

  tick();
  return stop;
}
