import SparkMD5 from './spark-md5'

export default function (file, callback) {
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    // 每次读取的块大小2M
    let chunkSize = 2097152;
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let spark = new SparkMD5.ArrayBuffer();
    let reader = new FileReader();

    loadNext();

    reader.onload = function (e) {
      spark.append(e.target.result); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        callback(null, spark.end());
      }
    };

    reader.onerror = function () {
      callback('oops, something went wrong.');
    };

    /////////////////////////
    function loadNext() {
        let start = currentChunk * chunkSize;
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        reader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

};

