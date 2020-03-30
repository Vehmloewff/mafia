export default function(id: string): string {
	return id.slice(0, 3) + `-` + id.slice(3, 6);
}
