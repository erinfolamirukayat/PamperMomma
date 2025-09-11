"use client";

interface ServiceContributionFormModalProps {
    showContributeForm: boolean;
    setShowContributeForm: (show: boolean) => void;
}
export function ServiceContributionFormModal({ showContributeForm, setShowContributeForm }: ServiceContributionFormModalProps) {
    if (!showContributeForm) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add Manual Contribution</h2>
                <p>This form is for the registry owner to manually add offline contributions.</p>
                <button onClick={() => setShowContributeForm(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
}