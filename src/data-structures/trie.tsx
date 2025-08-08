class TrieNode {
  character: string;
  nodes: Map<TrieNode["character"], TrieNode>;
  isEnd: boolean;

  constructor(
    character: string,
    options: {
      isEnd: boolean;
    }
  ) {
    this.character = character;
    this.nodes = new Map();
    this.isEnd = options.isEnd;
  }

  addNode(character: string, characterNode: TrieNode) {
    this.nodes.set(character, characterNode);
  }

  // ✅ Custom toJSON method for proper serialization
  toJSON() {
    return {
      character: this.character,
      nodes: Object.fromEntries(this.nodes), // Convert Map to Object
      isEnd: this.isEnd,
    };
  }

  // ✅ Static method to reconstruct from JSON
  static fromJSON(json: any): TrieNode {
    const node = new TrieNode(json.character, { isEnd: json.isEnd });

    // Reconstruct child nodes recursively
    for (const [char, childJson] of Object.entries(json.nodes)) {
      node.nodes.set(char, TrieNode.fromJSON(childJson));
    }

    return node;
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode("", { isEnd: false });
  }

  add(word: string) {
    let currentNode = this.root;
    const lastIndex = word.length - 1;

    for (let index = 0; index < word.length; index++) {
      const character = word[index];

      if (!currentNode.nodes.has(character)) {
        const characterNode = new TrieNode(character, {
          isEnd: index === lastIndex,
        });
        currentNode.nodes.set(character, characterNode);
      }

      currentNode = currentNode.nodes.get(character)!;
      currentNode.isEnd = index === lastIndex;
    }

    console.log(JSON.stringify(this, null, 2));
  }

  startsWith(word: string): boolean {
    let currentNode = this.root;

    for (let index = 0; index < word.length; index++) {
      const character = word[index];

      if (!currentNode.nodes.has(character)) {
        return false;
      }

      currentNode = currentNode.nodes.get(character)!;
    }

    return true;
  }

  search(word: string): boolean {
    let currentNode = this.root;

    for (let index = 0; index < word.length; index++) {
      const character = word[index];

      if (!currentNode.nodes.has(character)) {
        return false;
      }

      currentNode = currentNode.nodes.get(character)!;
    }

    return currentNode.isEnd;
  }

  // ✅ Serialize the entire Trie
  toJSON() {
    return {
      root: this.root.toJSON(),
    };
  }

  // ✅ Reconstruct Trie from JSON
  static fromJSON(json: any): Trie {
    const trie = new Trie();
    trie.root = TrieNode.fromJSON(json.root);
    return trie;
  }
}
