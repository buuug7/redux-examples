import { nanoid } from "@reduxjs/toolkit";
import {
  Factory,
  Server,
  association,
  Model,
  RestSerializer,
  hasMany,
  belongsTo,
} from "miragejs";
import faker from "faker";
import { article, sentence } from "txtgen";

new Server({
  routes() {
    this.namespace = "fakerApi";
    this.timing = 2000;
    this.resource("users");
    this.resource("posts");

    const server = this;
    this.post("/posts", function (schema, req) {
      const data = this.normalizedRequestAttrs();
      const result = server.create("post", {
        ...data,
        date: new Date().toISOString(),
      });
      return result;
    });
  },
  models: {
    user: Model.extend({
      posts: hasMany(),
    }),
    post: Model.extend({
      user: belongsTo(),
    }),
    notification: Model.extend({}),
  },
  factories: {
    user: Factory.extend({
      id() {
        return nanoid();
      },
      firstName() {
        return faker.name.firstName();
      },
      lastName() {
        return faker.name.lastName();
      },
      name() {
        return faker.name.findName(this.firstName, this.lastName);
      },
      username() {
        return faker.internet.userName(this.firstName, this.lastName);
      },

      afterCreate(user, server) {
        server.createList("post", 3, { user });
      },
    }),

    post: Factory.extend({
      id() {
        return nanoid();
      },
      title() {
        return sentence();
      },
      date() {
        return faker.date.recent(7);
      },
      content() {
        return article();
      },
      reactions() {
        return {
          thumbsUp: 0,
          hooray: 0,
          heart: 0,
          rocket: 0,
          eyes: 0,
        };
      },

      user: association(),

      afterCreate(post, server) {
        //
      },
    }),
  },
  seeds(server) {
    server.createList("user", 3);
  },
  serializers: {
    user: RestSerializer,
    post: RestSerializer,
  },
});
