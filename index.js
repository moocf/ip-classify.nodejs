const readline = require('readline');




// HELPER FUNCTIONS
// ----------------

// Convert an IP address to a 32-bit integer.
function toInt(ip) {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
}


// Convert a 32-bit integer back to an IP address string.
function toIP(int) {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}




// MAIN
// ----

// Create a readline interface for user input.
const rl = readline.promises.createInterface({
  input:  process.stdin,
  output: process.stdout
});


// Q1. Validate an IP address.
function validIP(ip) {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  return parts.every(p => /^\d+$/.test(p) && p >= 0 && p <= 255);
}


// Q2. Classify an IP address into classes A, B, C, D, or E.
function ipClass(ip) {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1   && firstOctet <= 126) return 'Class A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Experimental)';
  return 'Unknown';
}


// Q3. Calculate network address from an IP and subnet mask.
function networkAddress(ip, mask) {
  return toIP(toInt(ip) & toInt(mask));
}


// Q3. Calculate broadcast address from an IP and subnet mask.
function broadcastAddress(ip, mask) {
  return toIP((toInt(ip) & toInt(mask)) | ~toInt(mask));
}


// Q4. Calculate first IP address in the network.
function firstHost(netAddr) {
  return toIP(toInt(netAddr) + 1);
}


// Q4. Calculate last IP address in the network.
function lastHost(bcastAddr) {
  return toIP(toInt(bcastAddr) - 1);
}


// Q5. Check if two IPs are in the same network given a subnet mask.
function sameNetwork(ip1, ip2, mask) {
  return networkAddress(ip1, mask) === networkAddress(ip2, mask);
}


// Q6. Check if an IP address is private.
function isPrivate(ip) {
  const [first, second] = ip.split('.').map(Number);
  return (
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}


// Main function to run the CLI.
async function main() {
  const ip1  = await rl.question('Enter IP address: ');
  // Q1. Validate IP and subnet mask.
  if (!validIP(ip1)) {
    console.log('Invalid IP!');
    return rl.close();
  }
  // Q2. Classify the IP address.
  console.log(`IP Class: ${ipClass(ip1)}`);
  console.log();
  // Q3. Calculate network and broadcast addresses.
  const mask = await rl.question('Enter subnet mask: ');
  if (!validIP(mask)) {
    console.log('Invalid subnet mask!');
    return rl.close();
  }
  const netAddr   = networkAddress(ip1, mask);
  const bcastAddr = broadcastAddress(ip1, mask);
  console.log(`Network Address:   ${netAddr}`);
  console.log(`Broadcast Address: ${bcastAddr}`);
  console.log();
  // Q4. Calculate first and last valid IP addresses.
  console.log(`First valid IP: ${firstHost(netAddr)}`);
  console.log(`Last valid IP:  ${lastHost(bcastAddr)}`);
  console.log();
  // Q5. Check if two IPs are in the same network.
  const ip2 = await rl.question('Enter another IP to compare: ');
  if (!validIP(ip2)) {
    console.log('Invalid second IP!');
    return rl.close();
  }
  console.log(`Same network? ${sameNetwork(ip1, ip2, mask) ? 'Yes' : 'No'}`);
  console.log();
  // Q6. Check if the first IP is private.
  console.log(`IP Type: ${isPrivate(ip1) ? 'Private' : 'Public'} (${ip1})`);
  console.log();
  rl.close();
}
main();
