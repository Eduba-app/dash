export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 py-32">
            <h3 className="text-[#1C1C2E] text-2xl font-bold mb-3">
                No Users Registered Yet
            </h3>
            <p className="text-[#6B7280] text-sm text-center max-w-sm leading-relaxed">
                Your community hasn&apos;t started yet. Once students sign up for the
                app, they will appear here, and you&apos;ll be able to manage their
                subscriptions and track their progress.
            </p>
        </div>
    );
}