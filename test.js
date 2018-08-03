
var myObj = new MyObj(function () {
   console.log('myObj');
});

myObj.testMethod(() => {
   console.log('Variable', myObj.variable);
});

function MyObj (cb) {
    this.variable = 'hello';
    console.log('Obj constructor');
    cb('Done');

    this.testMethod = function (cb) {
        this.variable = 'Hi';
        cb();
    }
}
