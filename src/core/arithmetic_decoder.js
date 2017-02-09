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
  "Int16Array": Int16Array,
  "Int8Array": Int8Array,
  "Uint32Array": Uint32Array
};




var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 1*1024*1024;
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

  var offset_context = 0;   // 19 byte
  var offset_qetable = 20;  // 47 short
  var offset_nmps = 114; // 47 byte
  var offset_nlps = 161; // 47 byte
  var offset_switchFlag = 208; // 47 byte
  var offset_data = 256;

  var clow = 0;
  var chigh = 0;
  var bp = 0;
  var ct = 0;
  var a = 0;
  var dataEnd=0;


  function byteIn() {
    if ((bp | 0) >= (dataEnd | 0)) {
      clow = 0xFF00;
      ct = 8;
      return;
    }

    if ((HEAPU8[((offset_data) + (bp))|0]|0) == 0xFF) {
      if ((HEAPU8[((offset_data ) + (bp) +1) | 0]|0) > 0x8F) {
        clow = (clow + (0xFF00))|0;
        ct = 8;

      } else {
        bp = (bp+1)|0;
        if ( (bp|0) < (dataEnd|0)) {
          clow = ((clow) +  ((HEAPU8[((offset_data) + (bp)|0)]|0) << 9))|0;

        }
        ct = 7;

      }
    } else {
      bp = (bp + 1) | 0;
      clow = ((clow) + (bp) | 0) < (dataEnd|0) ? (HEAPU8[((offset_data) + (bp))|0] << 8) : 0xFF00;
      ct = 8;

    }
    if ((clow|0) > (0xFFFF|0)) {
      chigh = ((chigh) + (clow >>> 16))|0;
      clow = clow & 0xFFFF;
    }
      return;
  }

  function readBit(pos) {
    pos = pos | 0;

    // contexts are packed into 1 byte:
    // highest 7 bits carry cx.index, lowest bit carries cx.mps
    var cx_index = 0;
    var cx_mps = 0;
    var qeIcx = 0;
    var d = 0;
    var tmp_a= 0;
    cx_index = (HEAP8[(offset_context + pos)|0] >> 1);
    cx_mps = HEAP8[(offset_context + pos)|0] & 1;
    // var qeTableIcx = QeTable[cx_index];
    qeIcx = HEAPU16[((offset_qetable) + (((cx_index)*2)|0)|0) >> 1 ]|0;
    d = 0;
    tmp_a = ((a) - (qeIcx))|0;

    if ((chigh|0) < (qeIcx|0)) {
      // exchangeLps
      if ((tmp_a|0) < (qeIcx|0)) {
        tmp_a = qeIcx;
        d = cx_mps;
        cx_index = HEAPU8[(offset_nmps + cx_index)|0]|0;
      } else {
        tmp_a = qeIcx;
        d = 1 ^ cx_mps;
        if ((HEAPU8[(offset_switchFlag + cx_index)|0]|0) == 1|0) {
          cx_mps = d;
        }
        cx_index = HEAPU8[(offset_nlps + cx_index)|0]|0;
      }
    } else {
      chigh = ((chigh) - (qeIcx))|0;
      if ((tmp_a & 0x8000) != 0) {
        a = tmp_a;
        return cx_mps | 0;
      }
      // exchangeMps
      if ((tmp_a|0) < (qeIcx|0)) {
        d = 1 ^ cx_mps;
        if (HEAPU8[(offset_switchFlag + cx_index)|0]|0 == 1|0) {
          cx_mps = d;
        }
        cx_index = HEAPU8[(offset_nlps + cx_index)|0]|0;
      } else {
        d = cx_mps;
        cx_index = HEAPU8[(offset_nmps + cx_index)|0]|0;
      }
    }
    // C.3.3 renormD;

    do {
      if ((ct|0) == (0|0)) {
        byteIn();
      }

      tmp_a = tmp_a << 1;
      chigh = (((chigh << 1) & 0xFFFF) | ((clow >>> 15) & 1));
      clow = ((clow << 1) & 0xFFFF);
      ct = ((ct) -(1))|0;
    } while ((tmp_a & 0x8000) == 0);
    a = tmp_a;

    HEAP8[(offset_context+pos)|0] = (cx_index << 1 | cx_mps)|0;
    return d | 0;
  }

  function _init(start, end){
    start = start|0;
    end = end | 0;

    dataEnd = end;
    bp = start;

    chigh = HEAPU8[((offset_data | 0) + start)|0]|0;//data[start];
    clow = 0;

    byteIn();

    chigh = (((chigh << 7) & 0xFFFF) | ((clow >>> 9) & 0x7F));
    clow = ((clow << 7) & 0xFFFF);

    ct = (ct - 7)|0;
    a = 0x8000|0;
  }

  return {
    readBit: readBit,
    byteIn: byteIn,
    _init:_init,
  };

})(STDLIB, FOREIGN, HEAP);



(function () {
  var offset_context = 0;   // 19 byte
  var offset_qetable = 20;  // 47 short
  var offset_nmps = 114; // 47 byte
  var offset_nlps = 161; // 47 byte
  var offset_switchFlag = 208; // 47 byte
  var offset_data = 256;

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

  var initialized = false;
  ArithmeticDecoder.setup = function (data, start, end) {
    if (!initialized){
      copyInputData(offset_qetable, qeTable);
      copyInputData(offset_nmps, nmps);
      copyInputData(offset_nlps, nlps);
      copyInputData(offset_switchFlag, switchFlag);
      initialized = true;
    }

    var data_length = copyInputData(offset_data, data);
    ArithmeticDecoder._init(start, end)
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