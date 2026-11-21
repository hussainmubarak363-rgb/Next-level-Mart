package com.nextlevelmart.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

private const val API_BASE_URL = "http://10.0.2.2:4000"

private data class Product(val id: String, val name: String, val category: String, val price: Int, val unit: String, val emoji: String)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MartApp() }
    }
}

@Composable
private fun MartApp() {
    val green = Color(0xFF176B45)
    var products by remember { mutableStateOf(demoProducts) }
    var cartCount by remember { mutableIntStateOf(0) }
    var selectedCategory by remember { mutableStateOf("Sabhi") }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        Executors.newSingleThreadExecutor().execute {
            val remote = fetchProducts()
            if (remote.isNotEmpty()) products = remote
            loading = false
        }
    }

    MaterialTheme(colorScheme = lightColorScheme(primary = green, secondary = Color(0xFFFFB300))) {
        Scaffold(containerColor = Color(0xFFF7F8F5), bottomBar = {
            Surface(shadowElevation = 8.dp, color = Color.White) {
                Row(Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("🛒  Cart ($cartCount items)", fontWeight = FontWeight.Bold, fontSize = 17.sp)
                    Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = green)) { Text("View cart") }
                }
            }
        }) { padding ->
            LazyColumn(Modifier.fillMaxSize().padding(padding), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                item {
                    Text("Next Level Mart", fontSize = 25.sp, fontWeight = FontWeight.ExtraBold, color = green)
                    Text("Fresh groceries, delivered to your door", color = Color.DarkGray)
                    Spacer(Modifier.height(10.dp))
                    Surface(color = Color(0xFFE7F3EA), shape = RoundedCornerShape(14.dp), modifier = Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(16.dp)) {
                            Text("Namaste! 👋", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                            Text("Aaj kya chahiye? Fresh sabzi aur grocery yahin milegi.")
                        }
                    }
                }
                item {
                    Text("Categories", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                        listOf("Sabhi", "Sabzi", "Fruits", "Grocery").forEach { category ->
                            FilterChip(selected = selectedCategory == category, onClick = { selectedCategory = category }, label = { Text(category) })
                        }
                    }
                }
                item { Text(if (loading) "Popular items · loading…" else "Popular items", fontWeight = FontWeight.Bold, fontSize = 18.sp) }
                items(products.filter { selectedCategory == "Sabhi" || it.category.equals(selectedCategory, ignoreCase = true) }) { product ->
                    Surface(color = Color.White, shape = RoundedCornerShape(16.dp), shadowElevation = 1.dp) {
                        Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(product.emoji, fontSize = 32.sp)
                            Column(Modifier.weight(1f).padding(horizontal = 12.dp)) {
                                Text(product.name, fontWeight = FontWeight.Bold)
                                Text("₹${product.price} / ${product.unit} · ${product.category}", color = Color.Gray, fontSize = 13.sp)
                            }
                            OutlinedButton(onClick = { cartCount++ }) { Text("ADD") }
                        }
                    }
                }
                item { Text("Free delivery on your first order", color = green, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(vertical = 8.dp)) }
            }
        }
    }
}

private fun fetchProducts(): List<Product> = try {
    val connection = (URL("$API_BASE_URL/api/products").openConnection() as HttpURLConnection).apply {
        connectTimeout = 2500
        readTimeout = 2500
    }
    val json = JSONArray(connection.inputStream.bufferedReader().use { it.readText() })
    connection.disconnect()
    (0 until json.length()).map { i ->
        val item = json.getJSONObject(i)
        Product(item.getString("id"), item.getString("name"), item.getString("category"), item.getInt("price"), item.optString("unit", "piece"), item.optString("emoji", "🛍️"))
    }
} catch (_: Exception) { emptyList() }

private val demoProducts = listOf(
    Product("1", "Tamatar", "Sabzi", 30, "kg", "🍅"),
    Product("2", "Aloo", "Sabzi", 25, "kg", "🥔"),
    Product("3", "Kela", "Fruits", 50, "dozen", "🍌"),
    Product("4", "Doodh", "Grocery",  thirty(), "litre", "🥛"),
    Product("5", "Basmati Rice", "Grocery", 120, "kg", "🍚")
)

private fun thirty() = 30
