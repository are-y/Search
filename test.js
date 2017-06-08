// class Animal{
//   constructor(){
//     this.type="animal";
//   }
//   says(say){
//     setTimeout(()=>{
//         console.log(this.type+"says"+say)
//     },1000)
//   }
// }
//
// let animal=new Animal();
// animal.says("hello")
//
// class Cat extends Animal{
//   constructor(){
//     super()
//     this.type="cat"
//   }
// }
//
// let cat =new Cat()
// cat.says("hello")



// let cat ="ken"
// let dog="lili"
// let zoo={cat,dog}
//
// console.log(zoo)
//
// let zoom={type:"ken",animal:"liliilli"}
// let {type,animal}=zoom
//
// console.log(type,animal)




// function animal(type='cat'){
//   console.log(type)
// }
//
// animal()
//
// function a(...types){
//   console.log(types)
// }
//
// a('cat','type','hello')


// const s=new Set();
// [1,2,3,1,2,3,1,3,5,5,6,2,1,3,5,6,12,3,3,4].forEach(x=>s.add(x));
//
// for(let i of s ){
//   console.log(i);
// }
let  set =new Set();

set.add({});
set.add({})

console.log(set)
