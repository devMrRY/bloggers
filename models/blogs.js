const mongoose=require('mongoose')

const blog=mongoose.model('blog', {
    author_id:{
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        required:true,
        trim: true
    },
    description: {
        type: String,
        required:true,
        trim:true
    }
})

module.exports = blog
                 