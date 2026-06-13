const Post = require('../models/Post');

// Periodically check for scheduled posts to publish
setInterval(async () => {
    try {
        const now = new Date();
        const result = await Post.updateMany(
            { status: 'Scheduled', scheduledAt: { $lte: now } },
            { $set: { status: 'Published', publishedAt: now } }
        );
        if (result.modifiedCount > 0) {
            console.log(`Published ${result.modifiedCount} scheduled post(s)`);
        }
    } catch (error) {
        console.error('Error updating scheduled posts:', error);
    }
}, 60000); 
