import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Wifi, Sun, Warehouse } from 'lucide-react';
import heroImage from '../../../../public/assets/img/hero-courts.jpg';

export interface Court {
    id: number;
    name: string;
    type: 'indoor' | 'outdoor';
    surface: string;
    available: boolean;
    image: string | null;
}

const CourtCard = ({
    court,
    index,
    onSelect,
}: {
    court: Court;
    index: number;
    onSelect: (court: Court) => void;
}) => {
    const typeColors: Record<string, string> = {
        indoor: 'bg-blue-500 text-accent-foreground',
        outdoor: 'bg-secondary text-secondary-foreground',
    };

    return (
        <motion.div
            className="glass-card group cursor-pointer overflow-hidden rounded-xl bg-white text-black shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => court.available && onSelect(court)}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={heroImage}
                    alt={court.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={typeColors[court.type]}>
                        {court.type === 'indoor' ? (
                            <Warehouse className="mr-1 h-3 w-3" />
                        ) : (
                            <Sun className="mr-1 h-3 w-3" />
                        )}
                        {court.type}
                    </Badge>
                </div>
                {!court.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                        <span className="font-display text-lg font-bold text-primary-foreground">
                            Fully Booked
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="font-display mb-1 text-lg font-bold text-black">
                    {court.name}
                </h3>
                <p className="mb-4 text-sm text-black">
                    {court.surface} surface
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-black">
                        <Users className="h-4 w-4" />
                        <span>2–4 players</span>
                    </div>
                    <Button
                        // variant={court.available ? 'hero' : 'outline'}
                        // variant={'default'}
                        value={'default'}
                        size="lg"
                        disabled={!court.available}
                        className="cursor-pointer bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                    >
                        {court.available
                            ? 'View Available Time'
                            : 'Unavailable'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default CourtCard;
