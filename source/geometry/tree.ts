export default class Tree<T> {
    value: T;
    left: Tree<T>;
    right: Tree<T>;

    constructor(value: T, left: Tree<T>, right: Tree<T>) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}
