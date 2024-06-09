var db = new Dexie("sabzlearn");
const dbVersion = 1;

db.version(dbVersion).stores({
  courses: "_id",
  removedCourse: "_id",
  newCourses: "title",
  discounts: "discount",
});
