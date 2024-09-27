function byte_format(bytes) {
  bytes = bytes.toString().replace(/[^0-9.]/g, '');
  var sizes = ["B", "KB", "MB", "GB", "TB"];
  bytes = parseInt(bytes);
  if (bytes <= 0 || isNaN(bytes)) return "0 B";
  var i = Math.floor(Math.log(bytes) / Math.log(1000));
  return Math.round((bytes / Math.pow(1000, i) + Number.EPSILON) * 100) / 100 + ' ' + sizes[i];
}

document.getElementById("convert-byte").onclick = function () {
  let byte = document.getElementById("byte").value;
  let result = byte_format(byte);
  document.getElementById("preview-size").innerHTML = result
}

