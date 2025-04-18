import { Router } from "express";
import { OrderFactory } from "../factory/order.factory";
import { OrderRepository } from "../repository/order.repository";
import { OrderService } from "../service/order.service";
import { VehicleRepository } from "../../vehicle/repository/vehicle.repository";
import { PaymentService } from "../../payment/service/payment.service";
import { VehicleService } from "../../vehicle/service/vehicle.service";
import { VehicleFactory } from "../../vehicle/factory/vehicle.factory";
import { requireAuth } from "../../auth";

const vehicleFactory = new VehicleFactory();
const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository, vehicleFactory);
const orderRepository = new OrderRepository();
const orderFactory = new OrderFactory();
const paymentService = new PaymentService();
const orderService = new OrderService(
  orderRepository,
  orderFactory,
  vehicleService,
  paymentService
);

const orderController = Router();

orderController.post("/", requireAuth, async (req: any, res) => {
  const order = await orderService.create({
    ...req.body,
    userId: req.oidc.user.email,
  });

  res.send(
    JSON.stringify(
      {
        id: order.id,
        status: order.status,
        userId: order.userId,
        vehicleId: order.vehicleId,
      },
      null,
      2
    )
  );
});

orderController.post("/finish", requireAuth, async (req: any, res) => {
  const order = await orderService.finishOrder({
    ...req.body,
    userId: req.oidc.user.email,
  });

  res.send(
    JSON.stringify(
      {
        id: order.id,
        status: order.status,
        userId: order.userId,
        vehicleId: order.vehicleId,
      },
      null,
      2
    )
  );
});

orderController.patch("/", requireAuth, async (req: any, res) => {
  const order = await orderService.update({ ...req.body });
  res.send(
    JSON.stringify(
      {
        id: order.id,
        status: order.status,
        userId: order.userId,
        vehicleId: order.vehicleId,
      },
      null,
      2
    )
  );
});

orderController.get("/:id", requireAuth, async (req: any, res) => {
  const order = await orderService.get({ ...req.params.id });
  res.send(
    JSON.stringify(
      {
        id: order.id,
        status: order.status,
        userId: order.userId,
        vehicleId: order.vehicleId,
      },
      null,
      2
    )
  );
});

orderController.get("/", requireAuth, async (req: any, res) => {
  console.log(req.params.isAvailable);
  const orders = await orderService.list(req.params.isAvailable);

  res.send(
    JSON.stringify(
      orders.map((order) => ({
        id: order.id,
        status: order.status,
        userId: order.userId,
        vehicleId: order.vehicleId,
      })),
      null,
      2
    )
  );
});

export { orderController };
