class Node {
  #id
  #data = new Map()

  constructor (id) {
    this.#id = id
  }

  setValue = (key, value) => {
    this.#data.set(key, value)
  }

  getValue = (key) => this.#data.get(key)

  getData = () => {
    const result = {}

    for (let [key, value] of this.#data) {
      result[key] = value instanceof Node ? value.getData() : value
    }

    return result
  }
}

class Store {
  #store = new Map()

  createNode = id => {
    const node = new Node({ id })
    this.#store.set(id, node)
    return node
  }

  getNode = id => this.#store.get(id)

  getOrCreateNode = id => this.getNode(id) || this.createNode(id)

  getData = () => [...this.#store.values()].map(node => node.getData())
}

export { Store }
