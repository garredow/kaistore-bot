import { sub } from 'date-fns';
import fetch from 'node-fetch';
import { Database } from './db';
import { AppUpdate, DiscordMessage } from './models';

export async function checkNewApps() {
  console.log('Checking for new apps');

  const db = new Database();
  const latest = await db.getLatestAppUpdate();

  const afterDate = latest?.release_date ?? sub(new Date(), { weeks: 1 }).valueOf();

  const apps: any = await fetch('https://www.kaios.com.br/assets/data/radar/index.json')
    .then((res) => res.json())
    .catch((err) => {
      console.log(`Failed to fetch apps: ${err.message}`);
      return [];
    });

  const newApps: AppUpdate[] = (apps.context.itens as any[])
    .filter((a: any) => a.release_date > afterDate)
    .sort((a, b) => {
      if (a.release_date > b.release_date) return 1;
      else if (a.release_date < b.release_date) return -1;
      else return 0;
    });

  if (newApps.length === 0) {
    console.log('No new apps');
    return;
  }

  const hooks = await db.getWebhooks();

  for (const app of newApps) {
    const message: DiscordMessage = {
      embeds: [
        {
          title: app.name,
          description: app.summary,
          timestamp: new Date(app.release_date).toISOString(),
          author: {
            name: app.developer,
          },
          thumbnail: {
            url: app.thumbnail_url,
          },
          fields: [
            {
              name: 'Version',
              value: app.version,
              inline: true,
            },
            {
              name: 'Category',
              value: app.category,
              inline: true,
            },
          ],
        },
      ],
    };

    for (const hook of hooks) {
      await fetch(hook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      }).catch((err) =>
        console.log(`Failed to send ${app.bundle_id} to ${hook.name}: ${err.message}`)
      );
      console.log(`Sent ${app.bundle_id} to ${hook.name}`);
    }

    await db.addAppUpdate(app.bundle_id, app.version, app.release_date);
  }
}
