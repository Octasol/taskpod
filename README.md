# Taskpod

Taskpod is a decoupled part of the Octasol project designed to handle background tasks and job processing using BullMQ. It integrates with various services and APIs to fetch and update user profiles, manage queues, and log important information.


## Installation

1. Clone the repository:

```sh
git clone https://github.com/octasol/taskpod.git
cd taskpod
```

2. Install the dependencies:

```sh
npm install
```

## Configuration

1. Create a .env file in the root directory and add the following environment variables:

```env
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
DISCORD_WEBHOOK_URL=your_discord_webhook_url
DISCORD_WEBHOOK_URL_INFO=your_discord_info_webhook_url
DISCORD_WEBHOOK_URL_WARN=your_discord_warn_webhook_url
DISCORD_WEBHOOK_URL_ERROR=your_discord_error_webhook_url
```

2. Update the schema.prisma file with your database schema and run the migrations:

```sh
npx prisma generate
```

## Usage

Start the Taskpod worker:

```sh
npm start
```

This will initialize the workers and start processing tasks from the queues.

## Scripts

- `npm start`: Start the Taskpod worker.
- `npm run addTestTask`: Add a test task to the queue.
- `npm run getIncompleteJobs`: Get incomplete jobs from the queues.
- `npm run updateZeros`: Update total points for users with zero points.
- `npm run findUsersWithoutGithubProfile`: Find users without a GitHub profile.
- `npm run findUsersWithZeroPointsAndGithubProfile`: Find users with zero points and a GitHub profile.
- `npm run clean:failedTasks`: Clean the failed tasks file.
