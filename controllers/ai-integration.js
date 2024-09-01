
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new GoogleGenerativeAI(
  
    'AIzaSyC4LQnLt8Uw22NkIHNg2t_dZ5Z9tSttmug'
  
);

module.exports.GenAIHome = async function(req, res){
    let ai = client.getGenerativeModel({
        model:'gemini-1.5-flash'
    })
    let promt = "Marlval superheros"
    let result = (await ai.generateContent(promt)).response.text();
    console.log(result);
    return res.render('genAI', {result})
}