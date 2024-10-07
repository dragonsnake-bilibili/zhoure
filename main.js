window.addEventListener("load", async () => {
  // select elements
  const canvas_container = document.getElementById("canvas-container");
  const background_canvas = document.getElementById("background");
  const selection_canvas = document.getElementById("selection");
  const control_container = document.getElementById("control-container");
  const bounding_box_controls = document.getElementById("set-bounding-box");
  const frequent_controls = document.getElementById("frequent-controls");
  const watermark_checkbox = document.getElementById("add-watermark");
  const preset_selector = document.getElementById("preset-selector");

  // create contexts
  const background_context = background_canvas.getContext("2d");
  const selection_context = selection_canvas.getContext("2d");

  // listeners
  async function selector_change() {
    const preset = JSON.parse(preset_selector.value);
    const response = await fetch(preset.image);
    const image = await response.blob();
    const bitmap = await window.createImageBitmap(image);
    canvas_container.style.height = `${bitmap.height}px`;
    canvas_container.style.width = `${bitmap.width}px`;
    background_canvas.height = bitmap.height;
    background_canvas.width = bitmap.width;
    selection_canvas.height = bitmap.height;
    selection_canvas.width = bitmap.width;
    background_context.drawImage(bitmap, 0, 0);
    selection_context.strokeRect(...preset["x-y"], ...preset["width-height"]);
  }

  async function setup_listeners() {
    preset_selector.addEventListener("change", selector_change);
  }

  // helpers
  function render_watermark(canvas, canvas_context) {
    canvas_context.font = "bold 24px serif";
    const text = `访问${window.location.href}制作类似图片`;
    const measurement = canvas_context.measureText(text);
    // const width = measurement.actualBoundingBoxRight + measurement.actualBoundingBoxLeft;
    canvas_context.fillText(text, measurement.actualBoundingBoxLeft, measurement.actualBoundingBoxAscent);
  }

  async function load_presets() {
    // load presets from preset file and add which as selections
    const result = await fetch("data/presets.json");
    const presets = await result.json();
    presets.forEach((element, index) => {
      const selection = document.createElement("option");
      selection.value = JSON.stringify(element);
      selection.innerText = element.name;
      if (index === 0) {
        selection.selected = true;
      }
      preset_selector.appendChild(selection);
    });
    await selector_change();
  }

  // setup font
  background_canvas.font = "80px";

  await setup_listeners();
  await load_presets();
  if (watermark_checkbox.checked) {
    render_watermark(background_canvas, background_context);
  }
});