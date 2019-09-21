const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId){
  const course = await Course.update({_id: courseId}, 
  {$unset:{'author.name':''}} );
  course.save();
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
  console.log(course);
}

async function removeAuthor(courseId, authorID){
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorID);
  author.remove();
  course.save();
  console.log(course);
}

// updateAuthor('5d819fa0ccd564329c72b14e');

// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Posh' })
// ]);

// addAuthor('5d81a4d7bd50b2379c907469', new Author({name:'Bosh'}));


removeAuthor('5d81a4d7bd50b2379c907469', '55d81a8865bb353185c48b644');