import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import crypto, { createHash } from "crypto"

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
  max: 20,
  allowExitOnIdle: false 
});

export async function getData(database) {
  const client = await pool.connect();
  try {
  
    const res = await client.query(`SELECT * FROM ${database}`);
    
    await client.release();
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    await client.release();
  }
}


export async function getProduct(productId) {
  const client = await pool.connect();
  try {
    
    const res = await client.query(`SELECT * FROM products where product_id = '${productId}'`);
    
    await client.release();
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    await client.release();
  }
}
export async function getProducts(category) {
  const client = await pool.connect();
  try {
    
    const res = await client.query(`SELECT * FROM products where category_id = ${category}`);
    
    await client.release();
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    await client.release();
  }
}
export async function getCategories() {
  const client = await pool.connect();
  try {
    
    const res = await client.query(`SELECT * FROM categories`);
    let data = res.rows;
    let new_data = await Promise.all(
      data.map(async (category) => {
        category.products = await getProducts(category.category_id);
        category.promos = await getPromosByCateg(category.category_id);
        return category; // Ensure we return the modified category
      })
    );
    await client.release();
    return new_data;
  } catch (err) {
    console.error('Error executing query', err.stack);
    await client.release();
  }
}

export async function getImages(ProductId){
  const client = await pool.connect();
  try {
    let data = await client.query(`SELECT * FROM images where product_id = '${ProductId}'`)
    await client.release();
    data = data.rows
    return data;
  } catch (err){
    console.error('Error executing query', err.stack);
    await client.release();
  }
}


export async function GetUser(user_id) {
  const client = await pool.connect();
  try {
    const query = `SELECT address, created_at, email, first_name, last_name, phone_number, username, user_id FROM users where user_id = '${user_id}'`;

    const data = await client.query(query);
    await client.release();
    return data.rows[0];
  } catch (err) {
    return {success: false}
  } 
}

export async function SaveProduct(data,files) {

  const client = await pool.connect();
  const productId = uuidv4();
  const userId = data.user_Id;
  const categoryId = data.category_id;
  const name = data.name;
  const description = data.description;
  const quantity = data.quantity;
  const price = data.price
  const location = data.location
  
  try {
    const query = `INSERT INTO products (product_id, user_id, category_id, name, description, price,quantity, location, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    await client.query(query,[productId,userId,categoryId,name,description,price,quantity,location, false]);

    for (const file of files) {
      const imgQuery = `INSERT INTO images (product_id, path) VALUES ($1, $2)`;
      const values = [productId, file];
  
      // Execute the query for each file
      await client.query(imgQuery, values);
    } 
    
    await client.release();
    return {success: true, product_id: productId}
  } catch (err) {
    return {success: false}
  } 
}

export async function Activate(Id) {
  const client = await pool.connect();
  try {
    const query = `UPDATE products SET active = true where product_id = $1`;

    await client.query(query,[Id]);
    
    await client.release();
    return {success: true}
  } catch (err) {
    console.log(err)
    return {success: false}
  } 
}

export async function Inactivate(Id) {
  const client = await pool.connect();
  try {
    const query = `UPDATE products SET active = false where product_id = $1`;

    await client.query(query,[Id]);
    
    await client.release();
    return {success: true}
  } catch (err) {
    console.log(err)
    return {success: false}
  } 
}


export async function CreateUser(data){
  try{
    const email = data.email;
    const username = data.username;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const address = data.address;
    const number = data.phone_number;
    const password = data.password;
    const userId = uuidv4().replace(/-/g, '').substring(0, 6);
    
    if (email && username && firstName && lastName && address && number && password){
      const Hash = hashPassword(password);
  
      const client = await pool.connect();

      const VerifyQuery = "SELECT * FROM users where email = $1"
      const response = await client.query(VerifyQuery,[email])
      if (response.rows.length > 0){
        return {success: false, message: "Email Already Signed In"}
      }

  
      const query = "INSERT INTO users (user_id,username,email,password_hash,first_name,last_name,address, phone_number) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);";
  
      await client.query(query,[ userId, username, email, Hash, firstName, lastName, address, number ]);
      await client.release();
      return {success: true, user_id: userId}
    }
    return {success: false, message: "missing fields"}
  } catch (e) {
    return {success: false, message: "Error"}
  }
  

}


export async function Login(data){
  
  const email = data.email;
  const password = data.password;

  const Hash = hashPassword(password);

  const client = await pool.connect();
  const query = "SELECT * FROM users where email = $1";

  const response = await client.query(query,[email]);
  if (response.rows.length <= 0){
    return {success: false};
  }
  const foundUserData = response.rows[0];
  
  await client.release();

  if (Hash === foundUserData.password_hash){
    return {success: true, user_id: foundUserData.user_id};
  }
  return {success: false, message: "Email or Password Incorrect"};
}



export async function getAdByUserId(user_id) {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM products where user_id = '${user_id}'`;

    const data = await client.query(query);
    await client.release();
    return data.rows;
  } catch (err) {
    console.error('Error saving data:', err);
  } 
}


export async function deleteAdByProductId(product_id) {
  const client = await pool.connect();
  try {
    const query = `Delete FROM products where product_id = '${product_id}'`;

    await client.query(query);

    const imgquery = "Delete FROM images where product_id = $1"

    await client.query(imgquery,[product_id])
    await client.release();
    return {success: true}
  } catch (err) {
    return {success: false}
  } 
}

export async function EditAd(body,files){
  try {
    const client = await pool.connect();
    const { name, product_id, description, price, category_id, quantity, location } = body
    const AdQuery = "UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, quantity = $5, location = $6 WHERE product_id = $7"
  
    await client.query(AdQuery, [category_id,name,description, price, quantity, location, product_id])
  
    const DeleteImgQuery = `Delete FROM images where product_id = $1`
    await client.query(DeleteImgQuery,[product_id]);
  
    for (const file of files){
      const UploadImgQuery = `INSERT INTO images (product_id, path) VALUES ($1, $2)`;
      await client.query(UploadImgQuery,[product_id, file.path])
    }
    await client.release();
    return {success: true}
  } catch (err){
    console.log(err);
    return {success: false}
  }
}


export async function SearchAd(search_term){
  try {
    const client = await pool.connect();
    
    const ads = await client.query("SELECT * FROM products")

    const searchWords = search_term.split("-")

    const searchedAds = []

    for (const ad of ads.rows){
      for (const searchWord of searchWords){
        if (ad.name.toLowerCase().includes(searchWord)){
          searchedAds.push(ad)
        }
      }
    }

    const NoDuplicateSearchedAds = [...new Set(searchedAds)]

    return NoDuplicateSearchedAds
  } catch (err) {
    console.log(err)
    return null;
  }
}



export async function getMessages(convId){
  try {
    const client = await pool.connect();
    const data = await client.query("SELECT * FROM messages where conversation_id = $1", [convId])
    await client.release()
    return data.rows;
  } catch {
    return  {success: false}
  }
}
export async function getConversation(userId){
  try {
    const client = await pool.connect();
    const data = await client.query("SELECT * FROM conversations where person1_id = $1", [userId])
    const data2 = await client.query("SELECT * FROM conversations where person2_id = $1", [userId])
    const messages = [...data.rows,...data2.rows]
    await client.release()
    return messages;
  } catch {
    return  {success: false}
  }
}

export async function GetConversationById(convId) {
  try {
    const client = await pool.connect();
    const data = await client.query(`SELECT * FROM conversations where id = '${convId}'`, )
    await client.release()
    return data.rows;
  } catch (err) {
    return  {success: false}
  }
}



export async function SendMessage(msg){
  const { sender_id, receiver_id, content, conversation_id } = msg;
  const client = await pool.connect();
  await client.query(
    'INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4)',
    [conversation_id, sender_id, receiver_id, content]
  );
  await client.release()
}

export async function SearchConv(person1, person2) {
  const client = await pool.connect();
  const response = await client.query(`
     SELECT * FROM conversations
     where 
     (person1_id = $1 AND person2_id = $2)
     OR 
     (person1_id = $2 AND person2_id = $1)`, [person1, person2])
  
     await client.release();
  return response.rows
}

export async function CreateConv(person1, person2) {
  const client = await pool.connect();
  const convID = uuidv4().replace(/-/g, '').substring(0, 4);
  await client.query(`
     INSERT INTO conversations
     (id, person1_id, person2_id)
     VALUES
     ($1,$2,$3)`, [convID, person1, person2])
  
     await client.release();
  return {conversation_id: convID}
}



export async function AdminLogin(username, password) {
  const client = await pool.connect();
  const Hash = hashPassword(password);

  const query = "SELECT * FROM admins where username = $1";
  const response = await client.query(query, [username]);
  const data = response.rows;
  
  await client.release();
  for (const admin of data) {
    if (admin.password_hash === Hash) {
      return {success: true}
    }
  }
  return {success: false, message: "incorrect password or username"}

}

export async function GetAds() {
  const client = await pool.connect();
  const response = await client.query("SELECT * FROM products");
  await client.release();
  return response.rows
}
export async function GetUsers() {
  const client = await pool.connect();
  const response = await client.query("SELECT * FROM users");
  await client.release();
  return response.rows
}


export async function DeleteUser(Id) {
  try {
    const client = await pool.connect();
    await client.query("DELETE FROM users where user_id = $1", [Id])
    await client.release();
    return {success: true}
  } catch {
    return {success: false}
  }
}

export async function DeleteCategory(Id) {
  try {
    const client = await pool.connect();
    const result = await client.query("DELETE FROM categories WHERE category_id = $1", [Id]);
    await client.release();
    
    return { success: result.rowCount > 0 };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false };
  }
}

export async function CreateCategory(name,description) {
  try {
    const client = await pool.connect();
    await client.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [name, description]);
    await client.release();
    
    return { success: true };
  } catch (error) {
    console.error("Error Creating Category:", error);
    return { success: false };
  }
}

export async function CreatePlan(name, description, price, Features, Expiring) {
  try {
    const client = await pool.connect();
    await client.query("INSERT INTO plans (name, description, price, features, expiring_at) VALUES ($1, $2, $3, $4, $5)", [name, description, price, Features, Expiring]);
    await client.release();
    
    return { success: true };
  } catch (error) {
    console.error("Error Creating plan:", error);
    return { success: false };
  }
}

export async function GetPlans() {
  const client = await pool.connect();
  const response = await client.query("SELECT * FROM plans");
  await client.release();
  
  return response.rows;

}

export async function GetPlanById(Id) {
  const client = await pool.connect();
  const response = await client.query("SELECT * FROM plans where plan_id = $1", [Id]);
  await client.release();
  
  return response.rows[0];

}

export async function DeletePlan(Id) {
  try {
    const client = await pool.connect();
    const result = await client.query("DELETE FROM plans WHERE plan_id = $1", [Id]);
    await client.release();
    
    return { success: result.rowCount > 0 };
  } catch (error) {
    console.error("Error deleting Plan:", error);
    return { success: false };
  }
}

export async function getPromos() {
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM promotions")
  await client.release();
  return result.rows
}

export async function setPromoted(Id, pack, method, amount, exp) {
  const client = await pool.connect();
  await client.query("INSERT INTO promotions (ad_id, package, pay_method, amount, expiring_at ) VALUES ($1, $2, $3, $4, $5)", [Id, pack, method, amount, exp])
  await client.release();
}

async function getPromosByCateg(categ) {
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM promotions")
  let ads = result.rows;
  let new_data = []
  for (const ad of ads) {
    const data = await client.query("SELECT * FROM products where category_id = $1 AND product_id = $2 ", [categ, ad.ad_id]);
    new_data.push(data.rows[0]);
  }
  await client.release();
  
  return new_data;
}