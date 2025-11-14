const { Webhook } = require('svix');
const User = require('../models/User');

// This is the controller that handles the logic from the webhook
const handleClerkWebhook = async (req, res) => {
  // You can find this in your Clerk Dashboard under Webhooks
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set in .env');
    return res.status(500).send('Server configuration error');
  }

  // Get the headers from the request
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send('Error occurred -- no svix headers');
  }

  // Get the body (which is raw)
  const payload = req.body;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err.message);
    return res.status(400).send('Error occurred');
  }

  // Get the type of event
  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  // Now, we handle the different event types
  try {
    switch (eventType) {
      // WHEN A USER IS CREATED IN CLERK
      case 'user.created': {
        const { id, email_addresses, username, image_url } = evt.data;

        // Create a new user in our MongoDB database
        const newUser = new User({
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username,
          profile: {
            profilePictureUrl: image_url,
          },
          // Role defaults to 'user' as defined in our schema
        });

        await newUser.save();
        console.log(`User ${id} created in MongoDB.`);
        break;
      }

      // WHEN A USER IS UPDATED IN CLERK
      case 'user.updated': {
        const { id, email_addresses, username, image_url } = evt.data;

        // Find the user in our DB and update them
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: id },
          {
            email: email_addresses[0].email_address,
            username: username,
            profile: {
              profilePictureUrl: image_url,
            },
          },
          { new: true } // Return the updated document
        );

        if (!updatedUser) {
          console.warn(`User ${id} not found for update.`);
        } else {
          console.log(`User ${id} updated in MongoDB.`);
        }
        break;
      }

      // WHEN A USER IS DELETED IN CLERK
      case 'user.deleted': {
        const { id } = evt.data;

        // If no ID, we can't do anything
        if (!id) {
          console.error('User deleted event received, but no ID provided.');
          break;
        }

        // Find and delete the user from our DB
        const deletedUser = await User.findOneAndDelete({ clerkId: id });

        if (!deletedUser) {
          console.warn(`User ${id} not found for deletion.`);
        } else {
          console.log(`User ${id} deleted from MongoDB.`);
        }
        break;
      }
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }
  } catch (err) {
    console.error('Error processing webhook logic:', err.message);
    return res.status(500).send('Internal server error');
  }

  // Send a 200 OK response to Clerk to acknowledge receipt
  res.status(200).send('Webhook received and processed');
};

module.exports = { handleClerkWebhook };