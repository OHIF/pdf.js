var Module;

if (!Module) {
  Module = {};

  // The environment setup code below is customized to use Module.
  var ENVIRONMENT_IS_NODE = typeof process === 'object'
    && typeof require === 'function';
  var ENVIRONMENT_IS_WEB = typeof window === 'object';
  var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE
    && !ENVIRONMENT_IS_WORKER;

  if (ENVIRONMENT_IS_NODE) {
    // Expose functionality in the same simple way that the shells work
    // Note that we pollute the global namespace here, otherwise we break
    // in node
    // if (!Module['print'])
    //   Module['print'] = function print(x) {
    //     process['stdout'].write(x + '\n');
    //   };

    // if (!Module['printErr'])
    //   Module['printErr'] = function printErr(x) {
    //     process['stderr'].write(x + '\n');
    //   };

  } else if (ENVIRONMENT_IS_SHELL) {
    // if (!Module['print'])
    //   Module['print'] = print;

    // if (typeof printErr != 'undefined')
    //   Module['printErr'] = printErr; // not present in v8 or older sm
  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    // if (typeof console !== 'undefined') {
    //   if (!Module['print'])
    //     Module['print'] = function print(x) {
    //       console.log(x);
    //     };

    //   if (!Module['printErr'])
    //     Module['printErr'] = function printErr(x) {
    //       console.log(x);
    //     };
    // }
  }
}

var FOREIGN = {}

var STDLIB = {
  "Math": Math,
  "Int32Array": Int32Array,
  "Uint8Array": Uint8Array,
  "Uint16Array": Uint16Array,
  "Int8Array": Int8Array,
  "Uint32Array": Uint32Array
};




var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var HEAP = new ArrayBuffer(TOTAL_MEMORY);

var qeTable = new Uint16Array([
  0x5601,
  0x3401,
  0x1801,
  0x0AC1,
  0x0521,
  0x0221,
  0x5601,
  0x5401,
  0x4801,
  0x3801,
  0x3001,
  0x2401,
  0x1C01,
  0x1601,
  0x5601,
  0x5401,
  0x5101,
  0x4801,
  0x3801,
  0x3401,
  0x3001,
  0x2801,
  0x2401,
  0x2201,
  0x1C01,
  0x1801,
  0x1601,
  0x1401,
  0x1201,
  0x1101,
  0x0AC1,
  0x09C1,
  0x08A1,
  0x0521,
  0x0441,
  0x02A1,
  0x0221,
  0x0141,
  0x0111,
  0x0085,
  0x0049,
  0x0025,
  0x0015,
  0x0009,
  0x0005,
  0x0001,
  0x5601]);

var nmps = new Uint8Array([
  1,
  2,
  3,
  4,
  5,
  38,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  29,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  45,
  46
]);

var nlps = new Uint8Array([
  1,
  6,
  9,
  12,
  29,
  33,
  6,
  14,
  14,
  14,
  17,
  18,
  20,
  21,
  14,
  14,
  15,
  16,
  17,
  18,
  19,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  46
]);

var switchFlag = new Uint8Array([
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0]);






var ArithmeticDecoder = (function (stdlib, foreign, heap) {
  "use asm";



  var HEAPU8 = new stdlib.Uint8Array(heap);
  var HEAP8 = new stdlib.Int8Array(heap);
  var HEAPU16 = new stdlib.Uint16Array(heap);

  var data_length = 0;
  var offset_context = 0;   // 19 byte
  var offset_qetable = 20;  // 47 short
  var offset_nmps = 20 + 47 * 2; // 47 byte
  var offset_nlps = 20 + 47 * 2 + 47; // 47 byte
  var offset_switchFlag = 20 + 47 * 2 + 47 + 47; // 47 byte

  var offset_bp = 20 + 47 * 2 + 47 + 47 + 47 + 1; // 47 short
  var offset_chigh = 20 + 47 * 2 + 47 + 47 + 47 + 1 + 2; //short
  var offset_clow = 20 + 47 * 2 + 47 + 47 + 47 + 1 + 2 + 2; //short
  var offset_ct = 20 + 47 * 2 + 47 + 47 + 47 + 1 + 2 + 2 + 2; //short
  var offset_a = 20 + 47 * 2 + 47 + 47 + 47 + 1 + 2 + 2 + 2 + 2; //short
  var offset_dataEnd = 20 + 47 * 2 + 47 + 47 + 1 + 47 + 2 + 2 + 2 + 2 + 2; //short
  var offset_data = 20 + 47 * 2 + 47 + 47 + 47 + 1 + 2 + 2 + 2 + 2 + 2 + 2;

  function byteIn() {
    //var data = this.data;
    // var bp = this.bp;
    if (HEAPU16[offset_bp >> 1] >= data_length) {
      HEAPU16[offset_clow >> 1] = 0xFF00;
      HEAPU16[offset_ct >> 1] = 8;
      return;
    }
    if (HEAPU8[offset_data + HEAPU16[offset_bp >> 1]] === 0xFF) {
      var b1 = [HEAPU16[offset_bp >> 1] + 1];
      if (b1 > 0x8F) {
        HEAPU16[offset_clow >> 1] += 0xFF00;
        HEAPU16[offset_ct >> 1] = 8;

      } else {
        HEAPU16[offset_bp >> 1]++;
        if (HEAPU16[offset_bp >> 1] < HEAPU16[offset_dataEnd >> 1]) {
          HEAPU16[offset_clow >> 1] += (HEAPU8[offset_data + HEAPU16[offset_bp >> 1]] << 9) >>> 0;

        }
        // clow += ((bp >= data.length ? 0 : data[bp]<< 9));
        HEAPU16[offset_ct >> 1] = 7;

      }
    } else {
      HEAPU16[offset_bp >> 1]++;
      HEAPU16[offset_clow >> 1] += HEAPU16[offset_bp >> 1] < HEAPU16[offset_dataEnd >> 1] ? (HEAPU8[offset_data + HEAPU16[offset_bp >> 1]] << 8) : 0xFF00;
      HEAPU16[offset_ct >> 1] = 8;

    }
    if (HEAPU16[offset_clow >> 1] > 0xFFFF) {
      HEAPU16[offset_chigh >> 1] += (HEAPU16[offset_clow >> 1] >>> 16);
      HEAPU16[offset_clow >> 1] &= 0xFFFF;
    }
  }

  function readBit(pos) {
    var pos = pos | 0;

    // contexts are packed into 1 byte:
    // highest 7 bits carry cx.index, lowest bit carries cx.mps
    var cx_index = HEAP8[offset_context + pos] >> 1;
    var cx_mps = HEAP8[offset_context + pos] & 1;
    // var qeTableIcx = QeTable[cx_index];
    var qeIcx =  HEAPU16[(offset_qetable >> 1) + cx_index];
    var d = 0;
    var tmp_a = HEAPU16[offset_a >> 1] - qeIcx;

    if (HEAPU16[offset_chigh >> 1] < qeIcx) {
      // exchangeLps
      if (tmp_a < qeIcx) {
        tmp_a = qeIcx;
        d = cx_mps;
        cx_index = HEAPU8[offset_nmps + cx_index];
      } else {
        tmp_a = qeIcx;
        d = 1 ^ cx_mps;
        if (HEAPU8[offset_switchFlag + cx_index] === 1) {
          cx_mps = d;
        }
        cx_index = HEAPU8[offset_nlps + cx_index];
      }
    } else {
      HEAPU16[offset_chigh >> 1] -= qeIcx;
      if ((tmp_a & 0x8000) !== 0) {
        HEAPU16[offset_a >> 1] = tmp_a;
        return cx_mps | 0;
      }
      // exchangeMps
      if (tmp_a < qeIcx) {
        d = 1 ^ cx_mps;
        if (HEAPU8[offset_switchFlag + cx_index] === 1) {
          cx_mps = d;
        }
        cx_index = HEAPU8[offset_nlps + cx_index];
      } else {
        d = cx_mps;
        cx_index = HEAPU8[offset_nmps + cx_index];
      }
    }
    // C.3.3 renormD;

    do {
      if (HEAPU16[offset_ct >> 1] === 0) {
        byteIn();
      }

      tmp_a <<= 1;
      HEAPU16[offset_chigh >> 1] = (((HEAPU16[offset_chigh >> 1] << 1) & 0xFFFF) | ((HEAPU16[offset_clow >> 1] >>> 15) & 1));
      HEAPU16[offset_clow >> 1] = ((HEAPU16[offset_clow >> 1] << 1) & 0xFFFF);
      HEAPU16[offset_ct >> 1]--;
    } while ((tmp_a & 0x8000) === 0);
    HEAPU16[offset_a >> 1] = tmp_a;

    HEAP8[offset_context+pos] = cx_index << 1 | cx_mps;
    return d | 0;
  }

  function setInputDataLength(length) {
    length = length | 0;
    data_length = length | 0;
  }

  return {
    readBit: readBit,
    byteIn: byteIn,
    setInputDataLength: setInputDataLength
  };

})(STDLIB, FOREIGN, HEAP);



(function () {
  var data_length = 0;
  var offset_context = 0;   // 19 byte
  var offset_qetable = 20;  // 47 short
  var offset_nmps = 20 + 47 * 2; // 47 byte
  var offset_nlps = 20 + 47 * 2 + 47; // 47 byte
  var offset_switchFlag = 20 + 47 * 2 + 47 + 47; // 47 byte

  var offset_bp = 20 + 47 * 2 + 47 + 47 + 47 + 1; // 47 short
  var offset_chigh = 20 + 47 * 2 + 47 + 47 + 47 + 1 + 2; //short
  var offset_clow = 20 + 47 * 2 + 47 + 47 + 47 + 1+ 2 + 2; //short
  var offset_ct = 20 + 47 * 2 + 47 + 47 + 47 + 1+ 2 + 2 + 2; //short
  var offset_a = 20 + 47 * 2 + 47 + 47 + 47 + 1+ 2 + 2 + 2 + 2; //short
  var offset_dataEnd = 20 + 47 * 2 + 47 + 47 + 1+ 47 + 2 + 2 + 2 + 2 + 2; //short
  var offset_data = 20 + 47 * 2 + 47 + 47 + 47 + 1+ 2 + 2 + 2 + 2 + 2 + 2;

  function determineDataLength(data) {
    var data_length = 0;

    if ('length' in data) {
      data_length = data.length;
    } else if ('width' in data && 'height' in data) {
      data_length = data.width * data.height;
    } else {
      throw 'Unsupported input data format';
    }

    return data_length;
  }

  function copyInputData(data_offset, data) {
    var HEAPU8 = new Uint8Array(HEAP);

    if (data.data)
      data = data.data;

    if (data.buffer)
      data = new Uint8Array(data.buffer);


    var data_length = determineDataLength(data);

    // TODO: avoid copying data to the heap.
    for (var i = 0; i < data_length; i++)
      HEAPU8[data_offset + i] = data[i];

    return data_length;
  }

  ArithmeticDecoder.setup = function (data, start, end) {
    var HEAPU8 = new Uint8Array(HEAP);
    var HEAPU16 = new Uint16Array(HEAP);
    copyInputData(offset_qetable, qeTable);
    copyInputData(offset_nmps, nmps);
    copyInputData(offset_nlps, nlps);
    copyInputData(offset_switchFlag, switchFlag);
    var data_length = copyInputData(offset_data, data);
    ArithmeticDecoder.setInputDataLength(data_length);

    HEAPU16[offset_bp >> 1] = start;
    HEAPU16[offset_dataEnd >> 1] = end;

    HEAPU16[offset_chigh >> 1] = data[start];
    HEAPU16[offset_clow >> 1] = 0;

    ArithmeticDecoder.byteIn();

    HEAPU16[offset_chigh >> 1] = (((HEAPU16[offset_chigh >> 1] << 7) & 0xFFFF) | ((HEAPU16[offset_clow >> 1] >>> 9) & 0x7F));
    HEAPU16[offset_clow >> 1] = ((HEAPU16[offset_clow >> 1] << 7) & 0xFFFF);

    HEAPU16[offset_ct >> 1] -= 7;
    HEAPU16[offset_a >> 1] =  0x8000;

    return;
  };

  ArithmeticDecoder.createContext = function () {
    var contexts = new Int8Array(HEAP, offset_context, 19);
    for (var i = 0; i < 19; i++) {
      contexts[i] = 0;
    }
    return contexts;
  };
})();

// module.exports = ArithmeticDecoder;