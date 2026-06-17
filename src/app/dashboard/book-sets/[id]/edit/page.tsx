import { EditBundleForm } from "./_components/EditBundleForm";

interface EditBookSetPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBookSetPage({
    params,
}: EditBookSetPageProps) {
    const { id } = await params;
    return <EditBundleForm bundleId={id} />;
}