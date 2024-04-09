const { MerkleTree } = require('merkletreejs');
const { readFileSync } = require('fs');
const sha256 = require('./sha256');

const readFile = (filepath) => {
    return readFileSync(filepath);
}

// Function to split the file into 1024-byte chunks
const splitFileIntoChunks = (fileData, chunkSize = 1024) => {
    return Array.from(
        { length: Math.ceil(fileData.length / chunkSize) },
        (_, index) => fileData.slice(index * chunkSize, (index + 1) * chunkSize)
    );
}

const constructMerkleTree = async (filepath) => {
    return new Promise((resolve, reject) => {
        try {
            const fileData = readFile(filepath);
            const leaves = splitFileIntoChunks(fileData);
            const tree = new MerkleTree(leaves, sha256);
            const root = tree.getRoot().toString('hex');
            resolve(root);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

const compareMerkleTrees = (tree1, tree2) => {
    const root1 = tree1.getRoot();
    const root2 = tree2.getRoot();

    // Compare root hashes
    if (root1.toString('hex') !== root2.toString('hex')) {
        return false;
    }

    // Compare each segment of the tree
    const stack1 = [tree1.getRoot()];
    const stack2 = [tree2.getRoot()];

    while (stack1.length > 0 && stack2.length > 0) {
        const node1 = stack1.pop();
        const node2 = stack2.pop();

        // Compare node hashes
        if (sha256(node1) !== sha256(node2)) {
            return false;
        }

        // Push child nodes to stacks
        if (node1.left && node2.left) {
            stack1.push(node1.left);
            stack2.push(node2.left);
        }
        if (node1.right && node2.right) {
            stack1.push(node1.right);
            stack2.push(node2.right);
        }
    }

    // If one tree has more nodes than the other, they are not equal
    return stack1.length === 0 && stack2.length === 0;
}

const verifyMerkleTree = (storedMerkleTree, filepath) => {
    const calculatedMerkleTree = constructMerkleTree(filepath);
    return compareMerkleTrees(storedMerkleTree, calculatedMerkleTree);
}

const verifyMerkleRoot = (storedMerkleRoot, filepath) => {
    const calculatedMerkleRoot = constructMerkleTree(filepath);
    return {
        calculatedMerkleRoot: calculatedMerkleRoot,
        storedMerkleRoot: storedMerkleRoot
    }
}

module.exports = { constructMerkleTree };




