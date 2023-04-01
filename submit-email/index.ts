import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import fetch from 'node-fetch';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const email = req.body.email;
  context.log('Submitting email..!', email);

  // make a fetch request to the API
  try {
    const response = await fetch(
      process.env.CORS_PROXY_URL + process.env.NOTION_API,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: {
            database_id: process.env.NOTION_DATABASE_ID,
          },
          properties: {
            // Save email
            Email: {
              title: [
                {
                  text: {
                    content: email,
                  },
                },
              ],
            },
            // Save date
            Date: {
              date: {
                // set current date and time in chicago timezone
                start: new Date(),
              },
            },
          },
        }),
      }
    );
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: response,
    };
  } catch (error) {
    context.log(error);

    context.res = {
      status: 500,
      body: error,
    };
  }
};

export default httpTrigger;
