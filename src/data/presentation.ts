export interface SlideMetadata {
  id: number;
  title: string;
  subtitle?: string;
}

export const presentationData: SlideMetadata[] = [
  { id: 1, title: "Introduction", subtitle: "DHCPv4, DHCPv6 & SLAAC" },
  { id: 2, title: "DHCPv4", subtitle: "Comment fonctionne DHCPv4 ?" },
  { id: 3, title: "Cisco DHCP", subtitle: "Configurer DHCPv4 sur Cisco" },
  { id: 4, title: "DHCP Relay", subtitle: "DHCPv4 Relay" },
  { id: 5, title: "IPv6", subtitle: "Adressage IPv6" },
  { id: 6, title: "SLAAC", subtitle: "Stateless Address Autoconfiguration" },
  { id: 7, title: "Flags A/O/M", subtitle: "Les indicateurs A, O et M" },
  { id: 8, title: "DAD & EUI-64", subtitle: "Création et vérification d'une adresse IPv6" },
  { id: 9, title: "DHCPv6", subtitle: "DHCPv6 Stateless vs Stateful" },
  { id: 10, title: "Conclusion", subtitle: "DHCPv6 Relay & Synthèse" },
];
