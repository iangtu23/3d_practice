export default class Alpha {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get cubic() {
    let result = this.x * this.y * this.z;
    return result;
  }

  say() {
    console.log("say something");
  }
}
