# Ansible deployment for Online Local Mart

## Prerequisites
- Ansible 2.14+ on your control machine
- Target host has Docker Engine and Docker Compose v2 plugin (playbook can install on Debian/Ubuntu)
- Clone this repository to the target host (or set `project_src` to the correct path)

## Prepare
```bash
ansible-galaxy collection install -r requirements.yml
```

Optional: copy and edit environment variables:
```bash
cp ../.env.example ../.env
# edit values as needed
```

## Run
Run locally (on the same machine that hosts Docker):
```bash
ansible-playbook -i "localhost," -c local site.yml
```

Start with MongoDB (optional profile):
```bash
ansible-playbook -i "localhost," -c local site.yml -e with_db=true
```

Stop services:
```bash
ansible-playbook -i "localhost," -c local site.yml -e app_state=stopped
```

Restart services:
```bash
ansible-playbook -i "localhost," -c local site.yml -e app_state=restarted
```

Update containers (pull latest and recreate):
```bash
ansible-playbook -i "localhost," -c local site.yml -e pull_images=true -e app_state=restarted
```

## Notes
- The playbook loads `.env` via Docker Compose. Ensure it exists at the project root.
- Set `with_db=true` to enable the `mongodb` service (Compose profile `db`). If your app uses Atlas, keep it `false` and set `MONGO_URI` in `.env`.


