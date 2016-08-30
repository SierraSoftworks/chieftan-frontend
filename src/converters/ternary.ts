export class TernaryValueConverter {
  toView<T>(condition: boolean, ifTrue: T, ifFalse: T): T {
    return condition ? ifTrue : ifFalse;
  }
}
