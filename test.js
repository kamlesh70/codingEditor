function fun(static, ...tags) {
  console.log(static);
  console.log(tags);
}

let name = "kamlesh";

fun`my name is ${name}`; // this is called tagged template literals.
