require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

const admin = require('firebase-admin')

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env['FIREBASE_type'],
      project_id: process.env['FIREBASE_project_id'],
      private_key_id: process.env['FIREBASE_private_key_id'],
      private_key: process.env['FIREBASE_private_key'].replace(/\\n/g, '\n'),
      client_email: process.env['FIREBASE_client_email'],
      client_id: process.env['FIREBASE_client_id'],
      auth_uri: process.env['FIREBASE_auth_uri'],
      token_uri: process.env['FIREBASE_token_uri'],
      auth_provider_x509_cert_url: process.env['FIREBASE_auth_provider_x509_cert_url'],
      client_x509_cert_url: process.env['FIREBASE_client_x509_cert_url'],
    }),
  })
} catch (e) {}

const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
  try {
    if (req.query.token !== process.env['COMMENTS_TOKEN']) {
      res.status(534)
      res.end()
      return
    }
    const slug = req.query.slug
    if (!slug) {
      res.status(534)
      res.end()
      return
    }
    const firebase = admin.firestore()
    const commentsRef = firebase.collection('comments')
    const comments = await commentsRef.get()
    const posts = comments.docs
      .map((doc) => doc.data())
      .filter((doc) => doc.slug === slug)
      .map((doc) => {
        const { name, content, time, slug } = doc
        return { name, content, time: time.seconds, slug }
      })
    res.json({ posts })
    res.end()
    return
  } catch (e) {
    console.log(e.message || e.toString())
    res.status(534)
    res.end()
    return
  }
})

app.post('/', async (req, res) => {
  try {
    if (req.query.token !== process.env['COMMENTS_TOKEN']) {
      res.status(534)
      res.end()
      return
    }
    const firebase = admin.firestore()
    const { name, slug, content, email } = req.body
    const commentsRef = firebase.collection('comments')
    await commentsRef.add({ name, slug, content, email, time: admin.firestore.Timestamp.fromDate(new Date()) })
    res.status(200)
    res.end()
    return
  } catch (e) {
    console.log(e.message || e.toString())
    res.status(534)
    res.end()
    return
  }
})

app.listen(port)
