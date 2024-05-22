  // const predictClassification = require('../services/inferenceService');
  // const crypto = require('crypto');

  // async function postPredictHandler(request, h) {
  //   const { image } = request.payload;
  //   const { model } = request.server.app;

  //   const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
  //   const id = crypto.randomUUID();
  //   const createdAt = new Date().toISOString();

  //   const data = {
  //     "id": id,
  //     "result": label,
  //     "suggestion": suggestion,
  //     "confidenceScore": confidenceScore,
  //     "createdAt": createdAt
  //   }

  //   const response = h.response({
  //     status: 'success',
  //     message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
  //     data
  //   })
  //   response.code(201);
  //   return response;
  // }

  // module.exports = postPredictHandler;

const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

const postPredictHandler = async (request, h) => {
  await storeData(id, data);
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    if (Buffer.byteLength(image) > 1000000) {
      const response = h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000'
      });
      response.code(413);
      return response;
    }

    const { confidenceScore, label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "confidenceScore": confidenceScore,
      "createdAt": createdAt
    }

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    })
    response.code(201);
    return response;
  } catch (error) {

    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    });
    response.code(400);
    return response;
  }
}

module.exports = postPredictHandler;
