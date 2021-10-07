import express from 'express'
import {MongoClient} from 'mongodb'


const app = express()
const port = 8000

//this is for allow JSON  requests
app.use(express.json()) //For JSON requests

app.get('/api/articles/:name', (req,res) => {
    try {
        const articleName = req.params.name
        MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, (error, client) => {
            if (error) {
                res.status(500).json({ message: 'Ups! Something happened', exception})
            }
            console.log('Connected correctly !')
            const db = client.db('my-blog')

            db.collection('articles').findOne({ name: articleName }, (error, articleInfo) => {
                if(error){
                    res.status(500).json(error)
                } else if (articleInfo === undefined){
                    res.status(404).send(`Article ${articleName} not found :-(`)
                } else {
                    res.status(200).json(articleInfo)
                }
                
            
            })
        })
    } catch (exception) {
        res.status(500).json({ message: 'Error Connecting to db', exception})
    }
    
})

app.post('/api/articles/:name/upvotes', (req, res) => {
    try {
        const articleName = req.params.name
        MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, (error, client) => {
            if (error) {
                res.status(500).json({ message: 'Ups! Something happened', exception})
            }
            console.log('Connected correctly !')
            const db = client.db('my-blog')

            db.collection('articles').findOneAndUpdate(
                { name: articleName }, 
                { $inc: { upvotes: +1 }},
                { returnOriginal: false},
                (error, result) => {
                    if (error) {
                        res.status(500).json(error)
                    } 
                    res.status(200).json(result.value)
                }
            )
        })
    } catch (exception) {
        res.status(500).json({ message: 'Error Connecting to db', exception})
    }
    
})

app.post('/api/articles/:name/add-comment', (req, res) => {
    const article = req.params.name
    if(articleInfo[article] === undefined) {
        res.status(404).send(`Article ${article} doest not exists!`)
    }
    else { 
        const {username, text} = req.body
        articleInfo[article].comments.push({username,text})
        res.status(200).send(articleInfo[article])
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})