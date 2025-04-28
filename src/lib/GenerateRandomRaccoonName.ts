export async function generateRandomRaccoonName() {
    let gerund = '';
    let adjective = '';

    const fetchRandomGerund = async () => {
        try {
            const response = await fetch('/words/gerunds.txt');
            const text = await response.text();
            const gerunds = text.split('\n').map((word) => word.trim()).filter(Boolean);
            
            gerund = gerunds[Math.floor(Math.random() * gerunds.length)];
        } catch (error) {
            console.error('Error fetching random gerund.', error);
        }
    }

    const fetchRandomAdjective = async () => {
        try {
            const response = await fetch('/words/adjectives.txt');
            const text = await response.text();
            const adjectives = text.split('\n').map((word) => word.trim()).filter(Boolean);
            adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        } catch (error) {
            console.error('Error fetching random adjective.', error);
        }
    }

    await Promise.all([fetchRandomGerund(), fetchRandomAdjective()]);

    gerund = gerund.charAt(0).toUpperCase() + gerund.substring(1).toLowerCase();
    adjective = adjective.charAt(0).toUpperCase() + adjective.substring(1).toLowerCase();

    const randomRaccoonName = `${adjective}${gerund}Raccoon`;

    return randomRaccoonName;
}