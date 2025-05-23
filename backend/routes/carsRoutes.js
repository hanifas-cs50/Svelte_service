const { eq } = require("drizzle-orm");
const { db } = require("../db/index");
const { cars } = require("../db/schema");

async function carsRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.get("/cars", async (request, reply) => {
    const result = await db.select().from(cars);
    return result;
  });

  fastify.post("/cars", async (request, reply) => {
    const { brand, model, price } = request.body;

    // console.log(brand, model, price);

    if (!brand || !model || price === undefined) {
      return reply
        .status(400)
        .send({ error: "Brand, model, and price are required." });
    }

    try {
      await db.insert(cars).values({ brand, model, price });
      reply.status(201).send({ message: "Car created" });
    } catch (err) {
      reply.status(500).send({ error: "Failed to create car" });
    }
  });

  fastify.put("/cars/:id", async (request, reply) => {
    const { id } = request.params;
    const { brand, model, price } = request.body;
  
    try {
      const result = await db
        .update(cars)
        .set({ brand, model, price })
        .where(eq(cars.id, id));
  
      if (result.rowCount === 0) {
        return reply.status(404).send({ error: "Car not found" });
      }
  
      reply.status(200).send({ message: "Car updated successfully" });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Failed to update car" });
    }
  });
  
  fastify.delete("/cars/:id", async (request, reply) => {
    const { id } = request.params;

    // console.log(id);

    try {
        await db.delete(cars).where(eq(cars.id, id));
        reply.status(201).send({ message: "Car deleted" });
    } catch (error) {
        reply.status(500).send({ error: "Failed to delete car" });        
    }
  });
}

module.exports = carsRoutes;
