window.addEventListener("load", async () => {
  // select elements
  const canvas = document.getElementById("canvas");
  const processor = document.createElement("canvas");

  // create contexts
  const context = canvas.getContext("2d");
  const processor_context = processor.getContext("2d");

  // listeners
  async function load_background() {
    const response = await fetch("zhoure.jpg");
    const image = await response.blob();
    const bitmap = await window.createImageBitmap(image);
    canvas.height = bitmap.height;
    canvas.width = bitmap.width;
    processor.height = bitmap.height;
    processor.width = bitmap.width;
    context.drawImage(bitmap, 0, 0);
    context.strokeRect(320, 271, 462, 260);
    const text = "拖拽或点击选择图片";
    context.font = "52px 'lxgw-wenkai-lite'";
    context.fillText(text, 319, 391);
    processor_context.drawImage(bitmap, 0, 0);
  }

  await load_background();
  function drag_helper(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  canvas.addEventListener("dragenter", drag_helper);
  canvas.addEventListener("dragover", drag_helper);
  async function produce_result(file) {
    const bitmap = await window.createImageBitmap(file);
    processor_context.drawImage(bitmap, 320, 271, 462, 260);
    const downloader = document.createElement("a");
    downloader.href = processor.toDataURL("image/jpeg");
    downloader.download = `${crypto.randomUUID()}.jpeg`;
    downloader.click();
  }
  canvas.addEventListener("drop", async (event) => {
    drag_helper(event);
    await produce_result(event.dataTransfer.files[0]);
  });
  canvas.addEventListener("click", async () => {
    const selector = document.createElement("input");
    selector.type = "file";
    selector.addEventListener("change", async (event) => {
      await produce_result(event.target.files[0]);
    });
    selector.click();
  });
});