# Concurrency Limit

The JavaScript runtime is single threaded and therefore does not truly support cuncurrency.
However, it does support the appearance of concurrency with combination of the [Event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick) runtime and built-in [Asynchronous functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

When working with external apis (e.g. REST), there is tendency that we make a large amount of api calls against the external service.
This could cause issues arising from over loading the external server.
Issues could range from the server's inability to respond, resulting in timeouts.
Or requests being rejected due to hitting a rate-limit threshold.
Or even exhausting the process memory had making those calls also incur some heavy memory computation, e.g. buffering of large downloads.

# The problem

Imagine an implementation of a function where we were to obtain all nodes of a tree structured data set.
Given we have a function that obtains descendants of a single node:

```ts
type Node = {
  id: string;
};

async function getDescendants(parentId: string): Promise<Node[]> {
  /* makes http request to an external service */
}
```

A naive way to implement a function that obtains the entire tree might look like this:

```ts
type Tree<T> = {
  node: T;
  children: Tree<T>[];
};

async function getTree(parentId: string): Promise<Tree<Node>[]> {
  const level0s = await getDescendants(parentId);  // can return n nodes
  return Promise.all(
    level0s.map(
      async (node) => ({
        node,
        children: await getTree(node.id),
      }),
    ),
  );
}
```

Depending on the size of the tree, this can create a large amount of promises all making calls to `getDescendants`.
This may not be a problem for the runtime per se, but it definitely puts a load on the external service.

You are to implement a utility that would enable limiting a maximum concurrency limit that a function can be called.
In the above case, such that we can control concurrency limit of `getDescedants`.
