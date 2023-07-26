// type Node = {
//   id: string;
// };

// async function getDescendants(parentId: string): Promise<Node[]> {
//   /* makes http request to an external service */
// }
// ```;

// ```ts
// type Tree<T> = {
//   node: T;
//   children: Tree<T>[];
// };

// async function getTree(parentId: string): Promise<Tree<Node>[]> {
//   const level0s = await getDescendants(parentId);  // can return n nodes
//   return Promise.all(
//     level0s.map(
//       async (node: Node) => ({
//         node,
//         children: await getTree(node.id),
//       }),
//     ),
//   );
// }

describe("solution", () => {
  // getDescendants mock
  // const mockGetDescendants = jest.fn((parentId: string) => Promise<Node[]>);

  it("call fn 20 times", async () => {
    let numberOfCalls = 0;
    let currentConcurentCalls = 0;
    let maximumConcurentCalls = 0;

    let nodes = new Array(20).fill(0);

    const fn = async (): Promise<void> => {
      if (currentConcurentCalls > 1) {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(1);
          }, 100);
        });

        return fn();
      }

      numberOfCalls++;

      currentConcurentCalls++;

      if (currentConcurentCalls > maximumConcurentCalls)
        maximumConcurentCalls = currentConcurentCalls;

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, 100);
      });

      currentConcurentCalls--;
    };

    let response = await Promise.all(
      nodes.map((el) => {
        return fn();
      })
    );

    expect(maximumConcurentCalls).toBeLessThan(3);
    expect(numberOfCalls).toBe(20);
  });
});
