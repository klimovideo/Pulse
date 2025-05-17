const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['task_assigned', 'comment', 'deadline', 'mention', 'pulse_request', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedItemType: {
    type: String,
    enum: ['task', 'project', 'comment', null],
    default: null
  },
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to sort by createdAt in descending order
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 