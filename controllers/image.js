
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

export const handleClarifai = (req, res) => {
    const PAT = 'a4e4d17e02d744ec8adb3060ff7133a7';
    const USER_ID = 'wu_nattapong';
    const APP_ID = 'SmartBrain';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    
    const {imageUrl} = req.body;
    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, 
            inputs: [
                { data: { image: { url: imageUrl, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            const output = response;
            res.json(output);
        }
    );
}