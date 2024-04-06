export default function ConversationDetailsOptions({ icon, name, subName }) {
  return (
    <div className="flex cursor-not-allowed flex-row items-center gap-4">
      <div className="rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 p-2 text-xl text-white ">
        {icon}
      </div>
      <div className="flex flex-col">
        <p>{name}</p>
        <p className="text-xs opacity-70 dark:opacity-25 ">{subName}</p>
      </div>
    </div>
  );
}
