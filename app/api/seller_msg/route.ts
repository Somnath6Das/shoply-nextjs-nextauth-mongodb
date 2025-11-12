export async function POST(request) {
  try {
    const { email, name, message } = await request.json();

    if (!email || !name || !message) {
      return NextResponse.json(
        { error: "Email, name, and message are required" },
        { status: 400 }
      );
    }

    const mongoClient = await client.connect();
    const db = mongoClient.db("e_com");

    const messagesCollection = db.collection("messages");
    const sellersCollection = db.collection("sellers");

    // ✅ Check if the seller already exists in sellers collection
    const existingSeller = await sellersCollection.findOne({ email });
    if (existingSeller) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller Account already exists.",
        },
        { status: 200 }
      );
    }

    // ✅ Check if a message was already sent by this email
    const existingMessage = await messagesCollection.findOne({ email });
    if (existingMessage) {
      return NextResponse.json(
        { success: false, message: "Message already sent by this seller." },
        { status: 200 }
      );
    }

    // ✅ If new seller/message, insert it
    const newSeller = { email, name, message, createdAt: new Date() };
    await messagesCollection.insertOne(newSeller);

    return NextResponse.json(
      { success: true, message: "Seller registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving seller:", error);
    return NextResponse.json(
      { error: "Failed to save seller" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db("e_com");
    const collection = db.collection("messages");

    const total = await collection.countDocuments();
    const messages = await collection
      .find({})
      .sort({ createdAt: -1 }) // latest on top
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      data: messages,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
