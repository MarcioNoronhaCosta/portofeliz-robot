const speech = require('@google-cloud/speech').v1p1beta1



  async function asyncRecognizeGCS(
    gcsUri,
    encoding,
    sampleRateHertz,
    languageCode
  ) {
  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const gcsUri = 'gs://my-bucket/audio.raw';
  // const encoding = 'Encoding of the audio file, e.g. LINEAR16';
  //const sampleRateHertz = 16000;
  // const languageCode = 'BCP-47 language code, e.g. en-US';

  const config = {

    languageCode: "pt-BR",

  };

  const audio = {
    uri: "gs://canteiro.appspot.com/audios/2bd0d5ed-60c3-41d4-92ba-389edd9feff9.wav"
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const result = await client.recognize(request)

console.log(JSON.stringify(result[0].alternatives[0].transcript))
  // [END speech_transcribe_async_gcs]
}


asyncRecognizeGCS(
"gs://canteiro.appspot.com/audios/8882f6a4-f0bc-47a7-b03a-01193b5b18c3",
"OGG_OPUS",
"",
"pt-BR")