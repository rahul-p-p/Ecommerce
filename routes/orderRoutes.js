// const express = require("express");
// const router = express.Router();
// const { readFile, writeFile } = require("../utils/fileHelper");

// // ================= CREATE ORDER =================
// router.post("/", (req, res) => {
//   const orders = readFile("orders.json");

//   const { userId, items, total, address, phone } = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: "User ID required" });
//   }

//   const newOrder = {
//     id: Date.now(),
//     userId,
//     items,
//     total,
//     address,
//     phone,
//     status: "Placed",
//     timeline: [
//       { step: "Placed", completed: true, date: new Date() },
//       { step: "Shipped", completed: false },
//       { step: "Delivered", completed: false }
//     ]
//   };

//   orders.push(newOrder);
//   writeFile("orders.json", orders);

//   res.json({ message: "Order placed", order: newOrder });
// });

// // ================= GET USER ORDERS =================
// router.get("/:userId", (req, res) => {
//   const orders = readFile("orders.json");
//   const userId = req.params.userId;

//   const userOrders = orders.filter(
//     o => String(o.userId) === String(userId)
//   );

//   res.json(userOrders);
// });

// // ================= CANCEL ORDER =================
// router.put("/:id/cancel", (req, res) => {
//   let orders = readFile("orders.json");

//   const id = parseInt(req.params.id);

//   orders = orders.map(order => {
//     if (order.id === id) {
//       return { ...order, status: "Cancelled" };
//     }
//     return order;
//   });

//   writeFile("orders.json", orders);

//   res.json({ message: "Order cancelled" });
// });

// router.get("/seller-orders/:sellerId", (req, res) => {
//   const orders = readFile("orders.json");

//   const sellerOrders = orders.filter(order =>
//     order.items.some(item => item.sellerId === req.params.sellerId)
//   );

//   res.json(sellerOrders);
// });

// router.put("/seller-order-status/:orderId", (req, res) => {
//   let orders = readFile("orders.json");
//   const { status, sellerId } = req.body;

//   orders = orders.map(order => {
//     if (order.id == req.params.orderId) {

//       // only update items belonging to this seller
//       const updatedItems = order.items.map(item => {
//         if (item.sellerId === sellerId) {
//           item.status = status;
//         }
//         return item;
//       });

//       return { ...order, items: updatedItems };
//     }
//     return order;
//   });

//   writeFile("orders.json", orders);
//   res.json({ message: "Updated" });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { readFile, writeFile } = require("../utils/fileHelper");


// ================= CREATE ORDER =================
router.post("/", (req, res) => {
  const orders = readFile("orders.json");

  const newOrder = {
    id: Date.now(),
    userId: req.body.userId,
    items: req.body.items,
    total: req.body.total,
    address: req.body.address,
    phone: req.body.phone,
    status: "Placed",
    timeline: [
      { step: "Placed", completed: true, date: new Date() },
      { step: "Shipped", completed: false },
      { step: "Delivered", completed: false }
    ]
  };

  orders.push(newOrder);
  writeFile("orders.json", orders);

  res.json(newOrder);
});


// ================= GET USER ORDERS =================
router.get("/:userId", (req, res) => {
  const orders = readFile("orders.json");

  const userOrders = orders.filter(
    o => String(o.userId) === String(req.params.userId)
  );

  res.json(userOrders);
});


// ================= GET SELLER ORDERS =================
router.get("/seller-orders/:sellerId", (req, res) => {
  const orders = readFile("orders.json");

  const sellerId = String(req.params.sellerId);

  const sellerOrders = orders.filter(order =>
    order.items.some(item => String(item.sellerId) === sellerId)
  );

  res.json(sellerOrders);
});


// ================= UPDATE ORDER STATUS =================
router.put("/seller-order-status/:orderId", (req, res) => {
  const orderId = Number(req.params.orderId);
  const { status } = req.body;

  const orders = readFile("orders.json");

  const index = orders.findIndex(o => o.id === orderId);

  if (index === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  const order = orders[index];

  // 🔥 UPDATE TIMELINE LOGIC
  const updatedTimeline = order.timeline.map(step => {
    if (step.step === status) {
      return {
        ...step,
        completed: true,
        date: new Date()
      };
    }

    // auto-mark previous steps
    const orderFlow = ["Placed", "Shipped", "Delivered"];
    const currentIndex = orderFlow.indexOf(status);
    const stepIndex = orderFlow.indexOf(step.step);

    return {
      ...step,
      completed: stepIndex <= currentIndex
    };
  });

  const updatedOrder = {
    ...order,
    status,
    timeline: updatedTimeline
  };

  orders[index] = updatedOrder;

  writeFile("orders.json", orders);

  res.json({
    message: "Order + timeline updated",
    order: updatedOrder
  });
});

// ================= CANCEL ORDER =================
router.put("/:id/cancel", (req, res) => {
  let orders = readFile("orders.json");

  const id = Number(req.params.id);

  orders = orders.map(order => {
    if (order.id === id) {
      return { ...order, status: "Cancelled" };
    }
    return order;
  });

  writeFile("orders.json", orders);

  res.json({ message: "Cancelled" });
});

module.exports = router;