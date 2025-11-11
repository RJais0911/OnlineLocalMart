#!/bin/bash
# Quick script to run Ansible playbook from WSL
# Usage: ./run-ansible-wsl.sh [options]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Running Ansible Playbook ===${NC}"

# Check if Ansible is installed
if ! command -v ansible-playbook &> /dev/null; then
    echo -e "${YELLOW}Ansible not found. Installing...${NC}"
    sudo apt update
    sudo apt install -y python3-pip
    pip3 install --user ansible
    export PATH=$PATH:~/.local/bin
fi

# Check if Docker is accessible
if ! docker ps &> /dev/null; then
    echo -e "${YELLOW}Warning: Docker may not be accessible${NC}"
    echo "Make sure Docker Desktop is running on Windows"
fi

# Navigate to ansible directory
cd "$(dirname "$0")"

# Run playbook with provided arguments
echo -e "${GREEN}Running: ansible-playbook -i 'localhost,' -c local site-legacy.yml $@${NC}"
ansible-playbook -i "localhost," -c local site-legacy.yml "$@"

echo -e "${GREEN}=== Done ===${NC}"

