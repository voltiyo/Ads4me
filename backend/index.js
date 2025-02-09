import { getCategories, getProducts, getProduct, getImages, GetUser, SaveProduct, CreateUser, Login, getAdByUserId, deleteAdByProductId, EditAd, SearchAd, getMessages, getConversation, GetConversationById, SendMessage, SearchConv, CreateConv } from './getData.js';
import e from 'express';
import cors from 'cors';
import path from "path";
import multer from 'multer';
import { Server as socketIo } from 'socket.io';
import http from 'http';


const app = e();
app.use(cors())
app.use(e.json())
app.use(e.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null,Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
app.use("/uploads", e.static("uploads"));


app.get("/getCategories", async (req,res) => {
    const data = await getCategories()
    
    res.send(data)
})
app.get("/getProducts/:category", async (req,res) =>{
    const category = req.params.category
    const data = await getProducts(category)
    res.send(data)
})
app.get("/getProduct/:productId", async (req,res) =>{
    const productId = req.params.productId
    const data = await getProduct(productId)
    res.send(data[0])
})


app.get("/getImages/:productId", async (req,res) => {
  try{
    const ProductId = req.params.productId;
    const data = await getImages(ProductId);
    res.send(data);
  } catch {
    res.send("error")
  }
})

app.post("/saveProduct", upload.array("images",4), async (req,res) => {
  
  if (!req.files || req.files.length === 0) {
    return res.send({ success: false, message: "missing images!" });
  }
  const imagePaths = req.files.map(file => file.path); 
  const response = await  SaveProduct(req.body, imagePaths);
  res.send(response);
})

app.get("/getOwner/:userId", async (req,res) => {
  const userId = req.params.userId;
  const data = await GetUser(userId);
  res.send(data)
  
})

app.post("/login", async (req,res) => {
  const resp = await Login(req.body);
  res.send(resp)
})

app.post("/register", async (req,res) => {
  const response = await  CreateUser(req.body);
  res.json(response)
})

app.get("/getAdsByUserId/:userid", async (req, res) => {
  let userId = req.params.userid;
  const response = await getAdByUserId(userId);
  res.send(response);
})


app.get("/deleteAdByProductId/:prodId", async (req,res) => {
  let prodid = req.params.prodId;
  const response = await deleteAdByProductId(prodid);
  res.send(response);
})


app.post("/EditAd/", upload.array("images",4) , async (req,res) => {
  const response = await EditAd(req.body, req.files);
  res.send(response);
})


app.get("/search/:searchTerm", async (req, res) => {
 const { searchTerm } = req.params;
 const response = await SearchAd(searchTerm);
 res.send(response);
})


const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
  origin: "*", // Allow all origins (adjust if needed)
  methods: ["GET", "POST"]
} 
});
server.listen("5172", () => {
    console.log("listening in port 5172")
})

app.get("/messages/:user_id", async (req,res) => {
  const { user_id } = req.params;
  const response = await getMessages(user_id);
  res.send(response);
})

app.get("/conversations/:user_id", async (req,res) => {
  const { user_id } = req.params;
  const response = await getConversation(user_id);
  res.send(response);
})


app.get("/searchConversation/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const response = await SearchConv(user1, user2);
  res.send(response);
})

app.get("/createNewConv/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const response = await CreateConv(user1, user2);
  res.send(response);
})


app.get("/conversation/:convId", async (req,res) => {
  const { convId } = req.params;
  const response = await GetConversationById(convId);
  res.send(response);
})


io.on('connection', (socket) => {
  
  console.log('a user connected');


  socket.on('join_room', (user_id) => {
    socket.join(user_id);
  });
  socket.on('send_message', async (msg) => {
      const { sender_id, receiver_id, content } = msg;

      await SendMessage(msg)

      io.to(receiver_id).emit('new_message', msg);
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
});

