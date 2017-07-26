import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const User = mongoose.model('user');

export default {
  serialize: (user, done) => {
    done(null, { _id : user._id });
  },
  deserialize: (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  },
  strategy: (username, password, done) => {
    User.findOne({ username })
      .catch(err => {
        throw new Error('Database error');
      })
      .then(user => {
        if(!user) done(null, false, { message: 'Invalid credentials' });
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw error;
          if(isMatch){
            done(null, user);
          }else{
            done(null, false, { message: 'Invalid credentials' });
          }
        });
      });
  }
}